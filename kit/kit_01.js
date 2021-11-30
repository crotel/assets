dom[0] = function() {
    // let ref,
    render = (output) => {
        //   $('section#current').innerHTML = output;
        document.querySelector(".central-featured").innerHTML = output;
    };
    render((ref = function EOF() {
            /*!<<<EOF
            <div class="central-featured-lang lang1" lang="" dir="" status="false">
            <a id="" href="" title="" class="link-box" data-slogan="">
            <strong>Write</strong>
            <small><bdi dir="ltr">description: </bdi></small> <span>update at: </span></small>
            </a>
            </div>
            <!-- #2. ja.wikipedia.org - 255 661 000 views/day -->
            <div class="central-featured-lang lang2" lang="" dir="" status="false">
            <a id="" href="" title="" class="link-box" data-slogan="">
            <strong>Paint</strong>
            <small><bdi dir="ltr">description: </bdi></small> <span>update at: </span></small>
            </a>
            </div>
            <!-- #3. es.wikipedia.org - 206 571 000 views/day -->
            <div class="central-featured-lang lang3" lang="" dir="" status="false">
            <a id="" href="" title="" class="link-box" data-slogan="">
            <strong>Code</strong>
            <small><bdi dir="ltr">description: </bdi></small> <span>update at: </span></small>
            </a>
            </div>
            <!-- #4. de.wikipedia.org - 195 875 000 views/day -->
            <div class="central-featured-lang lang4" lang="" dir="" status="false">
            <a id="" href="" title="" class="link-box" data-slogan="">
            <strong>Music</strong>
            <small><bdi dir="ltr">description: </bdi></small> <span>update at: </span></small>
            </a>
            </div>
            <!-- #5. ru.wikipedia.org - 192 649 000 views/day -->
            <div class="central-featured-lang lang5" lang="" dir="" status="false">
            <a id="" href="" title="" class="link-box" data-slogan="">
            <strong>Project</strong>
            <small><bdi dir="ltr">description: </bdi></small> <span>update at: </span></small>
            </a>
            </div>
            <!-- #6. fr.wikipedia.org - 154 260 000 views/day -->
            <div class="central-featured-lang lang6" lang="" dir="" status="false">
            <a id="" href="" title="" class="link-box" data-slogan="">
            <strong>Design</strong>
            <small><bdi dir="ltr">description: </bdi></small> <span>update at: </span></small>
            </a>
            </div>
            <!-- #7. zh.wikipedia.org - 126 171 000 views/day -->
            <div class="central-featured-lang lang7" lang="" dir="" status="false">
            <a id="" href="" title="" class="link-box" data-slogan="">
            <strong>Open Service</strong>
            <small><bdi dir="ltr">description: </bdi></small> <span>update at: </span></small>
            </a>
            </div>
            <!-- #8. it.wikipedia.org - 108 509 000 views/day -->
            <div class="central-featured-lang lang8" lang="" dir="" status="false">
            <a id="" href="" title="" class="link-box" data-slogan="">
            <strong>Film</strong>
            <small><bdi dir="ltr">description: </bdi></small> <span>update at: </span></small>
            </a>
            </div>
            <!-- #9. pt.wikipedia.org - 64 263 000 views/day -->
            <div class="central-featured-lang lang9" lang="" dir="" status="false">
            <a id="" href="" title="" class="link-box" data-slogan="">
            <strong>Core</strong>
            <small><bdi dir="ltr">description: </bdi></small> <span>update at: </span></small>
            </a>
            </div>
            <!-- #10. pl.wikipedia.org - 50 684 000 views/day -->
            <div class="central-featured-lang lang10" lang="" dir="" status="false">
            <a id="" href="" title="" class="link-box" data-slogan="">
            <strong>About</strong>
            <small><bdi dir="ltr">description: </bdi></small> <span>update at: </span></small>
            </a>
            </div>
            EOF
            */
        }).toString()
            .split(ref.name)[2]
            .replace(/\$\{([^}]+)\}/g,
                function(outer, inner, pos){
                    return this[inner];
                })

    );
    document.querySelector(".btn").addEventListener("click",(e)=>{
        e.preventDefault();
        console.log(e.target);
        window.sessionStorage.setItem("current",e.target.getAttribute("for"))
        console.log(e.target.getAttribute("for"));
        setTimeout(()=>jit.switch(e.target.getAttribute("for")),0)
    })
};